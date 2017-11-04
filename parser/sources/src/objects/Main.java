package objects;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Stream;

import parsing.factory.Parser;

/**
 * @author Gutemberg
 * 
 * @author Paul Bivic
 * @author Pierre Boulc'h
 * @author Mathieu Lochet
 * @author Hugues Marandeau
 * @author Adrien Thebault
 * 
 * Cette classe est la classe d'entrée du programme
 */
public class Main 
{
	/**
	 * Liste les documents à créer
	 */
	private static HashMap<String, Document> documents = new HashMap<>();
	
	/**
	 * Récupère tous les documents
	 * @param file
	 * 		Dossier dans lequel commencer la recherche
	 * @param files
	 * 		Liste des fichiers trouvés
	 */
	public static void find(File file, List<File> files)
	{
		//Si c'est un dossier, on recherche dedans
	    if(file.isDirectory())
	    {
	        List<File> _files = Arrays.asList(file.listFiles());
	        for(File f : _files)
	        	find(f, files);
	    } 
	    //Si c'est un fichier, on l'ajoute à la liste
	    else
	    {
	    	files.add(file);
	    }
	}
	
	/**
	 * Permet d'extraire le texte d'un fichier
	 * @param f
	 * 		Fichier au format UTF-8
	 * @return contenu du fichier
	 * @throws IOException
	 */
	public static String getText(File f) throws IOException
	{
		StringBuilder string = new StringBuilder();
		try(Stream<String> lines = Files.lines(f.toPath(), Charset.forName("UTF-8"))) {
			  lines.forEach(line->string.append(line));
			}
		catch(Exception e)
		{
			System.err.println("ERROR LOADING FILE");
			e.printStackTrace();
		}
	    return string.toString();
	}

	/**
	 * Point d'entrée du programme
	 * @param args
	 * 			arguments
	 * @throws IOException
	 */
	public static void main(String[] args) throws IOException
	{
		//Racine des fichiers
		File base = new File("docs");
		ArrayList<File> files = new ArrayList<>();
		find(base, files);
		long start = (System.currentTimeMillis());
		System.out.println("Début du parsing de "+files.size()+" fichiers.");
		
		//Début du parsing
		for(File f : files)
		{
			Page p = getPage(getDocument(f.getPath()), f.getName());
			Parser.INSTANCE.parse(f, f.getName(), p);
		}
		
		long middle = (System.currentTimeMillis());
		System.out.println("Parsing terminé en "+(middle - start)+" ms.");
		//Ecriture dans le fichier résultat
		for(String d : documents.keySet())
		{
			File f = new File("output/"+(d.replaceAll("/", "_"))+".json");
			Charset charset = Charset.forName("UTF-8");
			Writer writer = new OutputStreamWriter(new FileOutputStream(f), charset);
			try {
				writer.append("["+documents.get(d).toString()+"]");
			} finally {
				writer.close();
			}
		}
		long end = (System.currentTimeMillis());
		System.out.println("Ecriture de "+documents.values().size()+" documents terminé en "+(end - middle)+" ms.");
		System.out.println("Parsing terminé");
	}
	
	/**
	 * Récupère le document correspondant au fichier
	 * @param path
	 * 		Chemin du fichier
	 * @return Le document correspondant
	 */
	public synchronized static Document getDocument(String path)
	{
		return Parser.INSTANCE.getDocument(path, documents);
	}
	
	/**
	 * Récupère la page du document correspondant au fichier
	 * @param document
	 * 		Doccument correpondant au fichier
	 * @param path
	 * 		Chemin du fichier
	 * @return La page correspondante
	 */
	public synchronized static Page getPage(Document document, String path)
	{
		return Parser.INSTANCE.getPage(path, document);
	}

	/**
	 * Permet d'ajouter un document à la liste
	 * @param id
	 * 		ID unique du document
	 * @param d
	 * 		Document
	 */
	public static void addDocument(String id, Document d)
	{
		documents.put(id, d);
	}
}
