package objects;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * @see Input
 * Cette classe permet de modéliser un champ dans un document
 */
public class Champ extends Input
{
	/**
	 * Liste des annotations
	 */
	private List<Annotation> annotations;
	
	/**
	 * Crée un objet champ
	 * @param p
	 * 		Objet parent contenant le champ
	 * @param t
	 * 		Type du champ
	 */
	public Champ(Input p, String t) {
		super(p, t);
		annotations = new ArrayList<>();
		annotations.add(new Annotation());
	}

	/**
	 * Ajoute du texte à l'annotation
	 * @param word
	 * 		Texte à ajouter
	 */
	public void addWord(String word) 
	{
		annotations.get(annotations.size()-1).addWord(word);
	}
	
	public Input newLine() 
	{
		currentInput = new Line(this);
		return currentInput;
	}
	
	public void clearLine() 
	{
		annotations.get(annotations.size()-1).addLine((Line)currentInput);
	}
	
	public String toString()
	{
		return "{\"type\":\"area\", \"name\":\""+type+"\", \"points\":"+points+",\"annotations\":"+annotations+"}";
	}
	
	/**
	 * Permet de créer une annotation avec un texte complet
	 * @param text
	 * 		texte de l'annotation
	 */
	public void createNewAnnotation(String text)
	{
		Annotation a = new Annotation();
		a.addWord(text);
		annotations.add(a);
	}
}
