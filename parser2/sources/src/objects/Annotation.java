package objects;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * @see Input
 * Cette classe permet de modliser une annotation dans un document
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
	 * Ajoute du texte e l'annotation
	 * @param word
	 * 		Texte e ajouter
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
	 * Ajoute une ligne e l'annotation
	 * @param line
	 * 		Ligne ajoutee
	 */
	public void addLine(Line line)
	{
		lignes.add(line);
	}
}
