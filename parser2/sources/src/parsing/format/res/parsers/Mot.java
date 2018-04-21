package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'mot'
 */
public class Mot implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		//Information sur le mot généré
		int i = Parser.findCorrespondantIndex(text, '[', ']');
		text = text.substring(i+1);
		page.addWord(text.substring(1, text.length()-2));
		return text;
	}
}
