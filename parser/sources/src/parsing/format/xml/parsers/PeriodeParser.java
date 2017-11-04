package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author Gutemberg
 * Cette classe permet d'�liminer la p�riode des documents
 */
public class PeriodeParser
{

	/**
	 * Parse un �l�ment XML
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
