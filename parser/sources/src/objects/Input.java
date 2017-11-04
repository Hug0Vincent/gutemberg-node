package objects;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * Cette classe permet de modéliser une fiche
 */
public class Input 
{
	/**
	 * Liste des fiches et des champs
	 */
	protected List<Input> input;
	
	/**
	 * Fiche parente
	 */
	protected Input parent;
	
	/**
	 * Actuel input traité
	 */
	protected Input currentInput;
	
	/**
	 * Liste des points
	 */
	protected List<Point> points;
	
	/**
	 * Type de la fiche/champ
	 */
	protected String type;
	
	/**
	 * Permet de créer un objet Fiche
	 */
	public Input()
	{
		type = "";
		input = new ArrayList<>();
		points = new ArrayList<>();
	}
	
	/**
	 * Permet de créer un objet Fiche
	 * @param p
	 * 		Fiche contenant la fiche créée
	 * @param name
	 * 		Nom de la fiche
	 */
	public Input(Input p, String name)
	{
		parent = p;
		input = new ArrayList<>();
		points = new ArrayList<>();
		type = name;
	}
	
	/**
	 * Définit le type de la fiche
	 * @param t
	 * 		Type de la fiche
	 */
	public void setType(String t)
	{
		type = t;
	}
	
	/**
	 * Ajoute un point à la fiche
	 * @param x
	 * 		Coordonnée x
	 * @param y
	 * 		Coordonnée y
	 */
	public void addPoint(int x, int y) 
	{
		points.add(new Point(x, y));		
	}

	public String toString()
	{
		return "{\"type\":\"sheet\", \"name\":\""+type+"\", \"points\":"+points+",\"listInputs\":"+input+"}";
	}
	
	/**
	 * Ajoute du texte à l'objet
	 * @param word
	 * 		Texte à ajouter
	 */
	public void addWord(String word) 
	{
		//Avec notre conception, ce n'est pas possible d'avoir une fiche contenant du texte
		System.out.println("Impossible d'ajouter du texte a une fiche");
	}

	/**
	 * Crée un nouveau champs et l'ajoute à la liste
	 * @param type
	 * 		Type du champ ajouté
	 * @return le champ créé
	 */
	public Input newArticle(String type) 
	{
		Input i = null;
		if(currentInput == null)
			input.add(i = new Champ(this, type));
		return i;
	}
	
	/**
	 * Permet de générer les points d'une fiche à partir des inputs qui la forment
	 */
	public void createPointsFromInput() 
	{
		if(points.size() == 0)
		{
			int x1 = -1;
			int y1 = -1;
			int x2 = -1;
			int y2 = -1;
			for(Input i : input)
			{
				//On choisi les 4 points les plus opposés possible
				if(i.points.size() == 4)
				{
					if(i.points.get(0).x < x1 || x1 == -1)
						x1 = i.points.get(0).x;
					if(i.points.get(0).y < y1 || y1 == -1)
						y1 = i.points.get(0).y;
					
					if(i.points.get(2).x > x2 || x2 == -1)
						x2 = i.points.get(2).x;
					if(i.points.get(2).y > y2 || y2 == -1)
						y2 = i.points.get(2).y;
				}
			}
			points.add(new Point(x1, y1));
			points.add(new Point(x2, y1));
			points.add(new Point(x2, y2));
			points.add(new Point(x1, y2));
		}
	}
	
	/**
	 * Permet d'ajouter une nouvelle ligne textuelle à une annotation
	 * @return la ligne créée
	 */
	public Input newLine() 
	{
		return null;
	}
	
	/**
	 * Ajoute la ligne dernièrement créée à l'ensemble des lignes
	 */
	public void clearLine()
	{
		
	}
	
	/**
	 * Retourne le type de l'input
	 * @return Type de l'objet
	 */
	public String getType()
	{
		return type;
	}
	
	/**
	 * Permet d'ajouter un champ à la fiche
	 * @param c
	 * 		Champ à ajouter
	 */
	public void addChamp(Champ c)
	{
		input.add(c);
	}
}
