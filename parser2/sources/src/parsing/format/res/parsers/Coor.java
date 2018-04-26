package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'coor'
 */
public class Coor implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findIndex(text, ')');
		parseArgs(text.substring(0, i), page);
		text = text.substring(i+1);
		return text;
	}
	
	private void parseArgs(String args, Page page)throws IOException
	{
		String[] points = args.split(" ");
		int x = Integer.parseInt(points[0]);
		int y = Integer.parseInt(points[1]);
		if(page.getCurrentInput() != null)
			page.getCurrentInput().addPoint(x, y);
	}
}