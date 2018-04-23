package objects;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * Cette classe permet de modéliser une page
 */
public class Page
{
	/**
	 * Numéro de la page
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
	 * Crée une nouvelle page
	 * @param i
	 * 		Numéro de la page
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
	 * Fait un retour en arriére dans l'arborescence des fiches et champs
	 */
	public void inputIsParent()
	{
		if(currentInput.parent == null)
			currentInput.createPointsFromInput();
		currentInput = currentInput.parent;
	}

	/**
	 * Retourne la fiche ou champ sur lequel le parser travaille
	 * @return la fiche ou champ derniérement utilisé
	 */
	public Input getCurrentInput()
	{
		return currentInput;
	}

	/**
	 * Ajoute une fiche à la page
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
	 * Ajoute du texte é l'objet
	 * @param word
	 * 		Texte é ajouter
	 */
	public void addWord(String word)
	{
		if(currentInput != null)
			currentInput.addWord(word);
	}

	/**
	 * Ajoute un nouvel article é l'input traité
	 */
	public void newArticle()
	{
		if(currentInput != null)
			currentInput = currentInput.newArticle(type);
	}

	/**
	 * Défini les points de l'input courament utilisé
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
	 * Défini le type de la prochaine fiche créée
	 * @param s
	 * 		Type de la fiche
	 */
	public void setFieldType(String s)
	{
		type = s;
	}

	/**
	 * Permet d'ajouter une nouvelle ligne textuelle é une annotation
	 */
	public void newLine()
	{
		currentInput = currentInput.newLine();
	}

	/**
	 * Fait un retour en arriére dans l'arborescence des fiches et champs
	 */
	public void clearLine()
	{
		currentInput = currentInput.parent;
		currentInput.clearLine();
	}

	/**
	 * Permet d'ajouter un fiche é la page
	 * @param f
	 * 		Nouvelle fiche
	 */
	public void addFiche(Input f)
	{
		input.add(f);
	}
}
