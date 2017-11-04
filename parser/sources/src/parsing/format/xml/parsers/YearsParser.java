package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author Gutemberg
 * Cette classe permet de r�cup�rer la valeur de l'ann�e du document
 */
public class YearsParser
{
	/**
	 * Parse un �l�ment XML
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
