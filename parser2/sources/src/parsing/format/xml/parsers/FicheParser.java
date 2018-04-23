package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'fiche'
 */
public class FicheParser implements XMLTagParser {

	@Override
	public String parse(Element e, Accumulator acc)
	{
		Elements elements = e.children();
		//On crée une nouvelle fiche temporaire
		acc.addFiche(e.attributes().get("id"), e.attributes().get("type"));
		
		for(Element tmp : elements)
		{
			String tag = tmp.tagName();
			//Si on trouve une référence de zone, on la link é la fiche
			if(tag.equals("zoneref"))
				acc.linkInput(tmp.attributes().get("idref"));
			else if(tag.equals("champ"))
			{
				acc.addArea(e.attributes().get("id"), tmp.attributes().get("type"));
				//Si on trouve une référence de zone, on la link au champ
				if(tmp.children().size() == 1)
					acc.linkArea(tmp.children().first().attributes().get("idref"));
				//Sinon, c'est qu'il s'agit d'un contenu textuel
				else
					acc.linkText(tmp.text());
			}
		}
		//On génére la fiche et on la valide dans les pages concernées
		acc.generateFiche();
		return null;
	}

}
