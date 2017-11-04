package objects;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * Cette classe permet de mod�liser une page
 */
public class Page 
{
	/**
	 * Num�ro de la page
	 */
	private String id;
	
	/**
	 * Chemin vers l'image de la page
	 */
	private String image;
	
	/**
	 * Liste des fiches de la page
	 */
	private List<Input> input;
	
	/**
	 * Fiche courante
	 */
	private Input currentInput;
	
	/**
	 * Type de la prochaine fiche
	 */
	private String type;
	
	/**
	 * Cr�e une nouvelle page
	 * @param i
	 * 		Num�ro de la page
	 * @param path
	 * 		Chemin vers l'image de la page
	 */
	public Page(String i, String path) 
	{
		id = i;
		image = path;
		input = new ArrayList<>();
		type = "";
	}
	
	/**
	 * Fait un retour en arri�re dans l'arborescence des fiches et champs
	 */
	public void inputIsParent()
	{
		if(currentInput.parent == null)
			currentInput.createPointsFromInput();
		currentInput = currentInput.parent;
	}
	
	/**
	 * Retourne la fiche ou champ sur lequel le parser travaille
	 * @return la fiche ou champ derni�rement utilis�
	 */
	public Input getCurrentInput()
	{
		return currentInput;
	}
	
	/**
	 * Ajoute une fiche � la page
	 */
	public void addNewFiche(String name) 
	{
		currentInput = new Input(null, name);
		input.add(currentInput);
	}
	
	public String toString()
	{
		return "{\"id\":\""+id+"\", \"image\":\""+image+"\", \"sheetsIndex\":"+input+"}";
	}

	/**
	 * Ajoute du texte � l'objet
	 * @param word
	 * 		Texte � ajouter
	 */
	public void addWord(String word) 
	{
		if(currentInput != null)
			currentInput.addWord(word);
	}	

	/**
	 * Ajoute un nouvel article � l'input trait�
	 */
	public void newArticle() 
	{
		if(currentInput != null)
			currentInput = currentInput.newArticle(type);
	}
	
	/**
	 * D�fini les points de l'input courament utilis�
	 * @param point
	 * 		Point haut gauche
	 * @param point2
	 * 		Point haut droite
	 * @param point3
	 * 		Point bas droite
	 * @param point4
	 * 		Point bas gauche
	 */
	public void setPoints(Point point, Point point2, Point point3, Point point4) 
	{
		Input i = currentInput;
		i.points.clear();
		i.points.add(point);
		i.points.add(point2);
		i.points.add(point3);
		i.points.add(point4);
	}
	
	/**
	 * D�fini le type de la prochaine fiche cr��e
	 * @param s
	 * 		Type de la fiche
	 */
	public void setFieldType(String s)
	{
		type = s;		
	}

	/**
	 * Permet d'ajouter une nouvelle ligne textuelle � une annotation
	 */
	public void newLine() 
	{
		currentInput = currentInput.newLine();
	}
	
	/**
	 * Fait un retour en arri�re dans l'arborescence des fiches et champs
	 */
	public void clearLine() 
	{
		currentInput = currentInput.parent;
		currentInput.clearLine();
	}
	
	/**
	 * Permet d'ajouter un fiche � la page
	 * @param f
	 * 		Nouvelle fiche
	 */
	public void addFiche(Input f) 
	{
		input.add(f);
	}
}
