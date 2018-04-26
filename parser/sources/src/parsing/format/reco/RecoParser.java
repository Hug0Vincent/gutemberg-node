package parsing.format.reco;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Main;
import objects.Page;
import parsing.factory.SpecializedParser;
import parsing.factory.TagParser;
import parsing.format.reco.parsers.CaseReco;
import parsing.format.reco.parsers.DocReco;

/**
 * @author Gutemberg
 * Cette classe permet de parser un fichier RECO
 */
public class RecoParser implements SpecializedParser
{
	/**
	 * Singleton de l'objet
	 */
	public static final SpecializedParser INSTANCE = new RecoParser();

	/**
	 * Liste des parsers existant pour chaque extension
	 */
	protected static final HashMap<String, TagParser> parsers;
	static
	{
		parsers = new HashMap<>();
		parsers.put("docReco", new DocReco());
		parsers.put("caseReco", new CaseReco());
	}

	private RecoParser()
	{

	}

	public String parse(File file, Page page) throws IOException
	{
		String text = Main.getText(file).substring(1);
		return parse(text, page);
	}

	public String parse(String text, Page page) throws IOException
	{
		if(text.length() > 0)
		{
			//On d�coupe en deux �l�ments : la balise et ses arguments
			String[] elements = text.split(" ", 2);
			String balise = elements[0];
			String args = elements[1];
			//On appelle le parser correspondant � la balise
			args = parsers.getOrDefault(balise, new ErrorParser(balise)).parse(args, page);
			if(args.length() == 0)
				return "\0";
			return args;
		}
		return "\0";
	}

	public Document getDocument(String path, HashMap<String, Document> documents)
	{
		//G�n�re le nom du document
		String[] datas = path.split("_");
		String name = datas[0] + datas[1];
		//Cr�e le document s'il n'existe pas
		name = name.replace("\\", "_");
		if(!documents.containsKey(name))
			documents.put(name, new Document(name, Document.REGISTRES, ""));
		return documents.get(name);
	}

	public Page getPage(String path, Document document)
	{
		//R�cup�re le num�ro de la page
		String id = path.split("_")[2].split("\\.")[0];
		//Cr�e la page si elle n'existe pas
		if(!document.getPages().containsKey(id))
			document.getPages().put(id, new Page(id, "docs/"+path));
		return document.getPages().get(id);
	}
}
