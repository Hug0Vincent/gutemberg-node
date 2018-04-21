package objects;

/**
 * @author Gutemberg
 * Cette classe permet de modéliser une ligne textuelle dans un document
 */
public class Line extends Input
{
	/**
	 * Texte reconnu
	 */
	protected String text;
	
	/**
	 * Permet de créer un objet
	 * @param champ
	 * 		élément contenant
	 */
	public Line(Champ champ)
	{
		super(champ, "");
		text = "";
	}

	public Input newLine() 
	{
		return parent.newLine();
	}

	public void clearLine()
	{
		parent.clearLine();
	}
	
	/**
	 * Ecrit du texte dans la ligne
	 * @param word
	 * 		texte é écrire
	 */
	public void addWord(String word) 
	{
		text += word+" ";
		parent.addWord(word);
	}
	
	public String toString()
	{
		return "{\"text\":\""+text+"\", \"points\":"+points+"}";
	}
}
