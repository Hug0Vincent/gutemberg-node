package parsing.format.res.parsers;

import java.io.IOException;

import objects.Page;
import objects.Point;
import parsing.factory.Parser;
import parsing.factory.TagParser;

public class CCX implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.removeBlock(text, '[', ']');
		text = text.substring(i+1);
		i = Parser.removeBlock(text, '(', ')');
		text = text.substring(i+1);
		String[] datas = text.split(" ");
		int x1 = Integer.parseInt(datas[1]);
		int x2= Integer.parseInt(datas[4]);
		int y1 = Integer.parseInt(datas[2].substring(0, datas[2].length()-1)); 
		int y2 = Integer.parseInt(datas[5].substring(0, datas[5].length()-2));
		page.setPoints(new Point(x1, y1), new Point(x2, y1), new Point(x2, y2), new Point(x1, y2));
		return text;
	}

}
