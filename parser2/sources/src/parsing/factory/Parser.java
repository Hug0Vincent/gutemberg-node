package parsing.factory;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Page;
import parsing.format.reco.RecoParser;


/**
 * @author Gutemberg
 * Cette classe permet de rediriger chaque document vers le parser qui lui est attibué
 */
public class Parser 
{
	
	/**
	 * Singleton de l'objet
	 */
	public static final Parser INSTANCE = new Parser();
	
	/**
	 * Liste des parsers existant pour chaque extension
	 */
	protected static final HashMap<String, SpecializedParser> parsers;
	static
	{
		parsers = new HashMap<>();
		parsers.put("res", new parsing.format.res.ResParser());
		parsers.put("reco", RecoParser.INSTANCE);
		parsers.put("xml", new parsing.format.xml.XMLParser());
	}

	/**
	 * Fonction d'entrée pour le parsing d'un fichier
	 * @param file
	 * 		Le fichier contenant le texte é parser
	 * @param name
	 * 		Nom du fichier avec l'extension pour choisir le parser correspondant
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas été parsé
	 * @throws IOException
	 */
	public String parse(File file, String name, Page page) throws IOException
	{
		String[] cut = name.split("\\.");
		return parsers.getOrDefault(cut[cut.length-1], EmptyParser.INSTANCE).parse(file, page);
	}

	/**
	 * Fonction permettant de récupérer le document correspondant au nom du fichier
	 * @param path
	 * 		Chemin d'accés au fichier
	 * @param documents
	 * 		Liste des documents existant
	 * @return Le document correspondant
	 */
	public Document getDocument(String path, HashMap<String, Document> documents) 
	{
		String[] cut = path.split("\\.");
		return parsers.getOrDefault(cut[cut.length-1], EmptyParser.INSTANCE).getDocument(path, documents);
	}

	/**
	 * Fonction permettant de récupérer la page d'un document correspondante au nom du fichier
	 * @param path
	 * 		Chemin d'accés au fichier
	 * @param document
	 * 		Document correspondant au fichier
	 * @return La page correspondante
	 */
	public Page getPage(String path, Document document)
	{
		String cut[] = new StringBuilder(path).reverse().toString().split("\\.", 2);
		String file = new StringBuilder(cut[1]).reverse().toString();
		String ext = new StringBuilder(cut[0]).reverse().toString();
		return document != null ? parsers.getOrDefault(ext, EmptyParser.INSTANCE).getPage(file, document) : null;
	}
	
	/**
	 * Permet d'éliminer certaines balises inutiles ne se trouvant pas toujours aux mémes endroits
	 * @param text
	 * 		texte dont il faut retirer la balise
	 * @return Le texte sans la balise
	 */
	public static String eliminateLX(String text)
	{
		if(text.charAt(0) != '(' &&text.charAt(0) != ']')
			text = text.split("@",2)[1];
		return text;
	}
	
	/**
	 * Permet d'associer un caractére d'ouverture (, {, [... é un caractére de fermeture ], }, )
	 * @param text
	 * 		Texte é parcourir
	 * @param o
	 * 		Caractére d'ouverture
	 * @param c
	 * 		Caractére de fermeture
	 * @return L'index du caractére de fermeture
	 */
	public static int findCorrespondantIndex(String text, char o, char c)
	{
		int quote = 0;
		int escaped = 0;
		int i;
		int cpt = 0;
		char tmp;
		for(i = 0; i < text.length() && (cpt > 0 ||  i == 0); i++)
		{
			tmp = text.charAt(i);
			if(tmp == '\\')
				escaped++;
			else
			{
				if(tmp == o && (quote&1) == 0)
					cpt++;
				else if(tmp == c&& (quote&1) == 0)
					cpt--;
				else if(tmp == '"' && (escaped&1)==0)
					quote++;
				escaped = 0;
			}
		}
		return i;
	}

	/**
	 * Permet de retirer un block inutile
	 * TODO : méme fonction que findCorrespondantIndex ?
	 * @see findCorrespondantIndex
	 * @param text
	 * 		Texte é parcourir
	 * @param o
	 * 		Caractére d'ouverture
	 * @param c
	 * 		Caractére de fermeture
	 * @return L'index du caractére de fermeture
	 */
	public static int removeBlock(String text, char o, char c)
	{
		int quote = 0;
		int escaped = 0;
		int i = 0;
		int cpt = 0;
		char tmp;
		for(i = 0; i < text.length() && !(text.charAt(i) == ' ' && cpt == 0); i++)
		{
			tmp = text.charAt(i);
			if(tmp == '\\')
				escaped++;
			else
			{
				if(tmp == o && (quote&1) == 0)
					cpt++;
				else if(tmp == c&& (quote&1) == 0)
					cpt--;
				else if(tmp == '"' && (escaped&1)==0)
					quote++;
				escaped = 0;
			}
		}
		return i;
	}

	/**
	 * Permet de trouver le prochain index d'un caractére
	 * @param text
	 * 		Texte é parcourir
	 * @param c
	 * 		Caractére é trouver
	 * @return L'index du caractére
	 */
	public static int findIndex(String text, char c)
	{
		int i;
		int escaped = 0;
		int quote = 0;
		for(i = 0; i < text.length() && (text.charAt(i) != c || (quote&1)==1) ; i++)
		{
			if(text.charAt(i) == '\\')
				escaped++;
			else
			{
				if(text.charAt(i) == '"' && (escaped&1)==0)
					quote++;
				escaped = 0;
			}
		}
		return i;
	}


}
