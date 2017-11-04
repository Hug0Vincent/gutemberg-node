package objects;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * @see Input
 * Cette classe permet de modéliser une annotation dans un document
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
	 * Ajoute du texte à l'annotation
	 * @param word
	 * 		Texte à ajouter
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
	 * Ajoute une ligne à l'annotation
	 * @param line
	 * 		Ligne ajoutée
	 */
	public void addLine(Line line) 
	{
		lignes.add(line);	
	}
}
