package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author Gutemberg
 * Cette classe permet d'éliminer la période des documents
 */
public class PeriodeParser
{

	/**
	 * Parse un élément XML
	 * @param main
	 * 		element XML
	 */
	public void parse(Element main) 
	{
		Elements years = main.children();
		for(Element e : years)
			new YearsParser().parse(e);
	}
}
