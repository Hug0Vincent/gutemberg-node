package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author Gutemberg
 * Cette classe permet de récupérer la valeur de l'année du document
 */
public class YearsParser
{
	/**
	 * Parse un élément XML
	 * @param main
	 * 		element XML
	 */
	public void parse(Element main) 
	{
		Elements months = main.children();
		for(Element e : months)
			new MonthsParser().parse(e, main.attributes().get("valeur"));
	}
}
