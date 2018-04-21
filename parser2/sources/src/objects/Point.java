package objects;

/**
 * @author Gutemberg
 * Cette classe permet de modéliser un point dans l'espace pour le dessin des zones
 */
public class Point 
{
	/**
	 * Coordonnée x
	 */
	protected int x;
	
	/**
	 * Coordonnée y
	 */
	protected int y;
	/**
	 * Crée un objet point
	 * @param x
	 * 		Coordonnée x du point
	 * @param y
	 * 		Coordonnée y du point
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
