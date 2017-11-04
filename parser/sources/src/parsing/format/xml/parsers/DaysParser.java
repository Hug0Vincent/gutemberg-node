package parsing.format.xml.parsers;

import java.util.HashMap;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class DaysParser
{
	/**
	 * Liste des sous-parsers de balises existant
	 */
	private final HashMap<String, XMLTagParser> parsers;
	public DaysParser()
	{
		parsers = new HashMap<>();
		parsers.put("img", new ImgParser());
		parsers.put("zone", new ZoneParser());
		parsers.put("fiche", new FicheParser());
	}
	
	/**
	 * Parse un élément XML
	 * @param main
	 * 		element XML
	 * @param year
	 * 		date déjà reconnue
	 */
	public void parse(Element main, String date) 
	{
		Element day = main.children().first();
		Elements elements = day.children();
		//On récupère les données spécifique au document
		String name = new StringBuilder(elements.first().attributes().get("valeur")).reverse().toString().split("_",3)[2];
		name = new StringBuilder(name).reverse().toString();
		Accumulator acc = new Accumulator(name, main.attributes().get("valeur")+"/"+date);
		//On parse chaque balise
		for(Element e : elements)
			parsers.get(e.tagName()).parse(e, acc);
		acc.generateDocument();
	}
}
