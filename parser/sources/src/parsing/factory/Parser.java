package parsing.factory;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Page;
import parsing.format.reco.RecoParser;


/**
 * @author Gutemberg
 * Cette classe permet de rediriger chaque document vers le parser qui lui est attibu�
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
	 * Fonction d'entr�e pour le parsing d'un fichier
	 * @param file
	 * 		Le fichier contenant le texte � parser
	 * @param name
	 * 		Nom du fichier avec l'extension pour choisir le parser correspondant
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas �t� pars�
	 * @throws IOException
	 */
	public String parse(File file, String name, Page page) throws IOException
	{
		String[] cut = name.split("\\.");
		return parsers.getOrDefault(cut[cut.length-1], EmptyParser.INSTANCE).parse(file, page);
	}

	/**
	 * Fonction permettant de r�cup�rer le document correspondant au nom du fichier
	 * @param path
	 * 		Chemin d'acc�s au fichier
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
	 * Fonction permettant de r�cup�rer la page d'un document correspondante au nom du fichier
	 * @param path
	 * 		Chemin d'acc�s au fichier
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
	 * Permet d'�liminer certaines balises inutiles ne se trouvant pas toujours aux m�mes endroits
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
	 * Permet d'associer un caract�re d'ouverture (, {, [... � un caract�re de fermeture ], }, )
	 * @param text
	 * 		Texte � parcourir
	 * @param o
	 * 		Caract�re d'ouverture
	 * @param c
	 * 		Caract�re de fermeture
	 * @return L'index du caract�re de fermeture
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
	 * TODO : m�me fonction que findCorrespondantIndex ?
	 * @see findCorrespondantIndex
	 * @param text
	 * 		Texte � parcourir
	 * @param o
	 * 		Caract�re d'ouverture
	 * @param c
	 * 		Caract�re de fermeture
	 * @return L'index du caract�re de fermeture
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
	 * Permet de trouver le prochain index d'un caract�re
	 * @param text
	 * 		Texte � parcourir
	 * @param c
	 * 		Caract�re � trouver
	 * @return L'index du caract�re
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
