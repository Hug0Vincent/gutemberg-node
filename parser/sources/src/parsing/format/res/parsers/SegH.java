package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.TagParser;

/**
 * @author Gutemberg
 * Cette classe reconnait les balises 'segH' et 'segV'
 */
public class SegH implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		return text;
	}
}