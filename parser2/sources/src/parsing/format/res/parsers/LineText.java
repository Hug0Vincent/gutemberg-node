package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'lineText'
 */
public class LineText implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		page.newLine(); 
		// Informations de ccx, pas toujours présent
		int i = Parser.findCorrespondantIndex(text, '(', ')');
		parseArgs(text.substring(1, i), page);
		text = text.substring(i+1);
		text = text.substring(Parser.findIndex(text, '['));
		//liste des mots
		i = Parser.findCorrespondantIndex(text, '[', ']'); 
		parseContent(text.substring(1, i), page);
		//text = text.substring(i+1);
		page.clearLine();
		return text;
	}
	
	private void parseArgs(String text, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(text, page);
	}

	private void parseContent(String content, Page page) throws IOException
	{
		int i;
		if(content.length() > 0 && content.charAt(0) != ']')
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
