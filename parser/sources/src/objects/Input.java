package objects;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Gutemberg
 * Cette classe permet de mod�liser une fiche
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
	 * Actuel input trait�
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
	 * Permet de cr�er un objet Fiche
	 */
	public Input()
	{
		type = "";
		input = new ArrayList<>();
		points = new ArrayList<>();
	}
	
	/**
	 * Permet de cr�er un objet Fiche
	 * @param p
	 * 		Fiche contenant la fiche cr��e
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
	 * D�finit le type de la fiche
	 * @param t
	 * 		Type de la fiche
	 */
	public void setType(String t)
	{
		type = t;
	}
	
	/**
	 * Ajoute un point � la fiche
	 * @param x
	 * 		Coordonn�e x
	 * @param y
	 * 		Coordonn�e y
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
	 * Ajoute du texte � l'objet
	 * @param word
	 * 		Texte � ajouter
	 */
	public void addWord(String word) 
	{
		//Avec notre conception, ce n'est pas possible d'avoir une fiche contenant du texte
		System.out.println("Impossible d'ajouter du texte a une fiche");
	}

	/**
	 * Cr�e un nouveau champs et l'ajoute � la liste
	 * @param type
	 * 		Type du champ ajout�
	 * @return le champ cr��
	 */
	public Input newArticle(String type) 
	{
		Input i = null;
		if(currentInput == null)
			input.add(i = new Champ(this, type));
		return i;
	}
	
	/**
	 * Permet de g�n�rer les points d'une fiche � partir des inputs qui la forment
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
				//On choisi les 4 points les plus oppos�s possible
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
	 * Permet d'ajouter une nouvelle ligne textuelle � une annotation
	 * @return la ligne cr��e
	 */
	public Input newLine() 
	{
		return null;
	}
	
	/**
	 * Ajoute la ligne derni�rement cr��e � l'ensemble des lignes
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
	 * Permet d'ajouter un champ � la fiche
	 * @param c
	 * 		Champ � ajouter
	 */
	public void addChamp(Champ c)
	{
		input.add(c);
	}
}
