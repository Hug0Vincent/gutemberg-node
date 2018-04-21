package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;


/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'zone'
 */
public class ZoneParser implements XMLTagParser
{
	public String parse(Element e, Accumulator acc) 
	{
		//On récupére les zones
		String positions[] = e.text().split(" ");
		//On les ajoutes dans l'accumulateur
		acc.addZone(e.attributes().get("id"), positions);
		return null;
	}
}
