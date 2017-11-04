package objects;

/**
 * @author Gutemberg
 * Cette classe permet de mod�liser une ligne textuelle dans un document
 */
public class Line extends Input
{
	/**
	 * Texte reconnu
	 */
	protected String text;
	
	/**
	 * Permet de cr�er un objet
	 * @param champ
	 * 		�l�ment contenant
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
	 * 		texte � �crire
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
