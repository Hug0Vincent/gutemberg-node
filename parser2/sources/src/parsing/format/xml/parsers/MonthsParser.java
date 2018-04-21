package parsing.format.xml.parsers;

import java.util.HashMap;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author Gutemberg
 * Cette classe permet de récupérer la valeur du mois du document
 */
public class MonthsParser 
{
	/**
	 * Liste des mois existant existant et leur valeur
	 */
	private static final HashMap<String, Integer> months;
	static
	{
		months = new HashMap<>();
		months.put("Janvier", 1);
		months.put("Février", 2);
		months.put("Mars", 3);
		months.put("Avril", 4);
		months.put("Mai", 5);
		months.put("Juin", 6);
		months.put("Juillet", 7);
		months.put("Août", 8);
		months.put("Septembre", 9);
		months.put("Octobre", 10);
		months.put("Novembre", 11);
		months.put("Décembre", 12);
	}
	
	/**
	 * Parse un élément XML
	 * @param main
	 * 		element XML
	 * @param year
	 * 		date déjé reconnue
	 */
	public void parse(Element main, String year) 
	{
		Elements days = main.children();
		for(Element e : days)
			new DaysParser().parse(e, months.get(main.attributes().get("valeur"))+"/"+year);
	}
}
