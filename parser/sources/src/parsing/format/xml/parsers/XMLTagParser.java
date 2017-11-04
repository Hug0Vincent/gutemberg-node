package parsing.format.xml.parsers;

import org.jsoup.nodes.Element;

/**
 * @author Gutemberg
 * Cette classe sp�cifie la structure des sous-parsers pour chaque balise XML
 */
public interface XMLTagParser 
{
	/**
	 * Permet de parser un �l�ment XML
	 * @param e
	 * 		Element parser
	 * @param acc
	 * 		Objet permettant de m�moriser et de g�n�rer le document
	 * @return
	 * 		Le texte non pars�
	 */
	String parse(Element e, Accumulator acc);
}
