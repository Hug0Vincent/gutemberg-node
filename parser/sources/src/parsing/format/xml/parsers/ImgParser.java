package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'img'
 */
public class ImgParser implements XMLTagParser
{
	@Override
	public String parse(Element e, Accumulator acc) 
	{
		acc.addPage(e.attributes().get("id"), e.attributes().get("valeur"));
		return null;
	}
}
