package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'pageRecoTitre'
 */
public class PageTitreReco implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findCorrespondantIndex(text, '(', ')');
		parseZone(text.substring(0, i), page);
		text = text.substring(i+1);
		while(text.contains("("))
		{
			i = Parser.findCorrespondantIndex(text, '(', ')');
			parseContent(text.substring(0, i), page);
			text = text.substring(i+1);
		}
		return text;
	}
	
	private void parseZone(String args, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(args.substring(1), page);
	}
	
	private void parseContent(String content, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(content.substring(1), page);
	}
}