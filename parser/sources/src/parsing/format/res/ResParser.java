package parsing.format.res;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Main;
import objects.Page;
import parsing.factory.SpecializedParser;
import parsing.factory.TagParser;
import parsing.format.res.ErrorParser;
import parsing.format.res.parsers.Article;
import parsing.format.res.parsers.ArticleSansTitre;
import parsing.format.res.parsers.BandeauxReco;
import parsing.format.res.parsers.CCX;
import parsing.format.res.parsers.CadreReco;
import parsing.format.res.parsers.Coor;
import parsing.format.res.parsers.DivPub;
import parsing.format.res.parsers.LineText;
import parsing.format.res.parsers.Mot;
import parsing.format.res.parsers.PageReco;
import parsing.format.res.parsers.PageRecoTainer;
import parsing.format.res.parsers.PageTitreReco;
import parsing.format.res.parsers.ParIllustration;
import parsing.format.res.parsers.ParText;
import parsing.format.res.parsers.SegH;
import parsing.format.res.parsers.Separateur;
import parsing.format.res.parsers.TitreA;
import parsing.format.res.parsers.TitreJournal;
import parsing.format.res.parsers.ZoneLst;

public class ResParser implements SpecializedParser
{
	/**
	 * Singleton de l'objet
	 */
	public static final SpecializedParser INSTANCE = new ResParser();
	
	/**
	 * Liste des parsers existant pour chaque extension
	 */
	protected static final HashMap<String, TagParser> parsers;
	static
	{
		parsers = new HashMap<>();
		parsers.put("pageRecoTainer", new PageRecoTainer());
		parsers.put("pageRecoTitre", new PageTitreReco());
		parsers.put("pageReco", new PageReco());
		parsers.put("zoneLst", new ZoneLst());
		parsers.put("coor", new Coor());
		parsers.put("bandeauxReco", new BandeauxReco());
		parsers.put("divNoReco", new BandeauxReco());
		parsers.put("colonnesReco", new BandeauxReco());
		parsers.put("divPub", new DivPub());
		parsers.put("cadreReco", new CadreReco());
		parsers.put("segH", new SegH());
		parsers.put("segV", new SegH());
		parsers.put("articleSansTitre", new ArticleSansTitre());
		parsers.put("article", new Article());
		parsers.put("separateurFinArticle", new Separateur());
		parsers.put("separateurTrait", new Separateur());
		parsers.put("separateurFinColonne", new Separateur());
		parsers.put("parText", new ParText());
		parsers.put("parIllustration", new ParIllustration());
		parsers.put("parImg", new ParIllustration());
		parsers.put("lineText", new LineText());
		parsers.put("mot", new Mot());
		parsers.put("parTableau", new ParIllustration());
		parsers.put("titreA", new TitreA());
		parsers.put("titreJournal", new TitreJournal());
		parsers.put("ccx", new CCX());
	}
	
	public String parse(File file, Page page) throws IOException
	{
		String text = Main.getText(file).substring(1);
		return parse(text, page);
	}
	
	public String parse(String text, Page page) throws IOException
	{
		if(text.length() > 0)
		{
			//On découpe en deux éléments : la balise et ses arguments
			String[] elements = text.split(" ", 2);
			String balise = elements[0];
			String args = elements[1];
			//On appelle le parser correspondant à la balise
			args = parsers.getOrDefault(balise, new ErrorParser(balise)).parse(args, page);
			if(args.length() == 0)
				return "\0";
			return args;
		}
		return "\0";		
	}
	

	public Document getDocument(String path, HashMap<String, Document> documents)
	{
		//Génère le nom du document
		String[] datas = new StringBuilder(path.substring(5)).reverse().toString().split("\\.")[1].split("_", 4);
		String date = new StringBuilder(datas[1]).reverse().toString();
		String id = new StringBuilder(datas[2]).reverse().toString();
		String name = new StringBuilder(datas[3]).reverse().toString();

		//Crée le document s'il n'existe pas
		if(!documents.containsKey(name + id))
			documents.put(name + id, new Document(name, Document.PRESSE_ANCIENNE, date.substring(6, 8)+"/"+date.substring(4, 6)+"/"+date.substring(0, 4)));
		return documents.get(name + id);
	}

	public Page getPage(String path, Document document) 
	{
		//Récupère le numéro de la page
		String[] datas = new StringBuilder(path).reverse().toString().split("_");
		String page = new StringBuilder(datas[0]).reverse().toString();
		//Crée la page si elle n'existe pas
		if(!document.getPages().containsKey(page))
			document.getPages().put(page, new Page(page, "docs/"+path+".jpg"));
		return document.getPages().get(page);
	}
}
