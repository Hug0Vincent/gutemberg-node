package parsing.format.xml;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import objects.Document;
import objects.Page;
import parsing.factory.SpecializedParser;
import parsing.format.xml.parsers.PeriodeParser;

/**
 * @author Gutemberg
 * Cette classe permet de parser un fichier XML
 */
public class XMLParser implements SpecializedParser
{

	@Override
	public String parse(File file, Page page) throws IOException 
	{
		//Le parsing se fait grace é la librairie Jsoup qu'il suffit d'exploiter.
		org.jsoup.nodes.Document d = Jsoup.parse(file, "iso-8859-1");
		Element main = d.getElementsByTag("node").first();
		Elements periode = main.children();
		for(Element e : periode)
			new PeriodeParser().parse(e);
		return null;
	}
	
	@Override
	public String parse(String text, Page page) throws IOException {
		return null;
	}

	@Override
	public Document getDocument(String path, HashMap<String, Document> documents) {
		return null;
	}

	@Override
	public Page getPage(String path, Document document) {
		return null;
	}
}
