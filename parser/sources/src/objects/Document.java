package objects;
import java.util.HashMap;

/**
 * @author Gutemberg
 * Cette classe permet de mod�liser un document
 */
public class Document
{
	/**
	 * Constante du type 'presse ancienne'
	 */
	public static final String PRESSE_ANCIENNE = "Presse ancienne";

	/**
	 * Constante du type 'registre matricule'
	 */
	public static final String REGISTRES = "Registre matricule";

	/**
	 * Constante num�rique du type 'd�cret de naturalisation'
	 */
	public static final String DECRETS = "Décret de naturalisation";

	public static final String PAROISSIAUX = "Registre paroissiaux";

	/**
	 * Liste des pages du document
	 */
	private HashMap<String, Page> pages;

	/**
	 * Valeur correspondant � une des constantes d�finies
	 */
	private String type;

	/**
	 * Date du document
	 */
	private String date;

	/**
	 * Titre du document
	 */
	private String title;

	/**
	 * Permet de cr�er un document
	 * @param t
	 * 		Titre du document
	 * @param doc_type
	 * 		Type du document
	 * @param d
	 * 		Date du document
	 */
	public Document(String t, String doc_type, String d)
	{
		pages = new HashMap<>();
		type = doc_type;
		date = d;
		title = t;
	}

	public String toString()
	{
		return "{\"type\":\""+type+"\",\"date\":\""+date+"\",\"title\":\""+title+"\",\"pages\":"+pages.values().toString()+"}";
	}

	/**
	 * Retourne la date du document
	 * @return la date du document
	 */
	public String getDate()
	{
		return date;
	}

	/**
	 * Retourne le titre du document
	 * @return le titre du document
	 */
	public String getTitle()
	{
		return title;
	}

	/**
	 * Retourne les pages du document
	 * @return les pages du document
	 */
	public HashMap<String, Page> getPages()
	{
		return pages;
	}

	/**
	 * Ajoute une page au document
	 * @param id
	 * 		Num�ro de la page
	 * @param p
	 * 		Page � lier au document
	 */
	public void addPage(String id, Page p)
	{
		pages.put(id, p);
	}
}
