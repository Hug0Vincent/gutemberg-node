package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;

/**
 * @author Gutemberg
 * Cette classe spécifie la structure des sous-parsers pour chaque balise XML
 */
public interface XMLTagParser 
{
	/**
	 * Permet de parser un élément XML
	 * @param e
	 * 		Element parser
	 * @param acc
	 * 		Objet permettant de mémoriser et de générer le document
	 * @return
	 * 		Le texte non parsé
	 */
	String parse(Element e, Accumulator acc);
}
