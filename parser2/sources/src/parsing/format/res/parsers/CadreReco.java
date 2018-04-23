package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait les balises 'cadreReco'
 */
public class CadreReco implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findCorrespondantIndex(text, '(', ')');
		parseContent(text.substring(0, i), page);
		text = text.substring(i+1);
		return text;
	}
	
	
	private void parseContent(String content, Page page) throws IOException
	{
		int i;
		if(content.length() > 0 && content.charAt(0) != ')')
		{
			do
			{
				i = Parser.findCorrespondantIndex(content, '(', ')');
				ResParser.INSTANCE.parse(content.substring(1, i), page);
			}
			while(content.substring(i).length() > 0 && (content = content.substring(i)).charAt(0) == ',' && !(content = content.substring(2)).equals("\0"));
		}
	}
}