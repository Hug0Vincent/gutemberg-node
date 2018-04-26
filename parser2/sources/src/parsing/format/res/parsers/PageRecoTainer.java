package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'pageRecoTainer'
 */
public class PageRecoTainer implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findCorrespondantIndex(text, '[', ']');
		parseArgs(text.substring(0, i), page);
		text = text.substring(i+1);
		
		i = Parser.findCorrespondantIndex(text, '(', ')');
		parseContent(text.substring(1, i), page);
		text = text.substring(i);
		return text;
	}
	
	private void parseArgs(String args, Page page)
	{
	}
	
	private void parseContent(String content, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(content, page);
	}
}