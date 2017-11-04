package objects;

/**
 * @author Gutemberg
 * Cette classe permet de mod�liser un point dans l'espace pour le dessin des zones
 */
public class Point 
{
	/**
	 * Coordonn�e x
	 */
	protected int x;
	
	/**
	 * Coordonn�e y
	 */
	protected int y;
	/**
	 * Cr�e un objet point
	 * @param x
	 * 		Coordonn�e x du point
	 * @param y
	 * 		Coordonn�e y du point
	 */
	public Point(int x, int y) 
	{
		this.x = x;
		this.y = y;
	}
	
	public String toString()
	{
		return "{\"x\":"+x+",\"y\":"+y+"}";
	}
}
