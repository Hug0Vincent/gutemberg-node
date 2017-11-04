package objects;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * @see Input
 * Cette classe permet de mod�liser une annotation dans un document
 */
public class Annotation
{
	/**
	 * Texte reconnu
	 */
	private String text;
	
	/**
	 * Liste des lignes reconnues
	 */
	protected List<Line> lignes;
	
	/**
	 * Creation d'une annotation
	 */
	public Annotation()
	{
		text = "";
		lignes = new ArrayList<>();
	}
	
	/**
	 * Ajoute du texte � l'annotation
	 * @param word
	 * 		Texte � ajouter
	 */
	public void addWord(String word)
	{
		text+=word+" ";
	}
	
	public String toString()
	{
		return "{\"type\":\"annotationAutomatic\", \"modifiable\":false, \"textAuto\":\""+text+"\", \"lines\":"+lignes+"}";
	}
	
	/**
	 * Ajoute une ligne � l'annotation
	 * @param line
	 * 		Ligne ajout�e
	 */
	public void addLine(Line line) 
	{
		lignes.add(line);	
	}
}
