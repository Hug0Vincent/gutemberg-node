package parsing.format.xml.parsers;

import java.util.HashMap;
import java.util.HashSet;

import objects.Champ;
import objects.Document;
import objects.Input;
import objects.Main;
import objects.Page;

public class Accumulator 
{
	/**
	 * Liste des pages
	 */
	private HashMap<String, Page> pages;
	
	/**
	 * Liste des zones
	 */
	private HashMap<String, String[]> zones;
	
	/**
	 * Liste des fiches
	 */
	private HashMap<String, Input> fiches;
	
	/**
	 * Liens entre les zones et les pages
	 */
	private HashMap<String[], Page> linker;
	
	/**
	 * Liste des pages sur lesquelles une fiche peut se trouver
	 */
	private HashMap<Input, HashSet<Page>> fichesLinker;
	
	/**
	 * Liste des champs
	 */
	private HashMap<String, Champ> champs;
	
	/**
	 * Liens entre les champs et leurs positions
	 */
	private HashMap<Champ, String[]> areaLinker;
	
	/**
	 * Page courante
	 */
	private Page currentPage;
	
	/**
	 * Fiche courante
	 */
	private Input currentFiche;
	
	/**
	 * Champ courant
	 */
	private Champ currentChamp;
	
	/**
	 * Date du document
	 */
	private String date;
	
	/**
	 * Nom du document
	 */
	private String name;
	
	/**
	 * Crée un accumulateur
	 * @param n
	 * 		Nom du document
	 * @param d
	 * 		Date du document
	 */
	public Accumulator(String n, String d)
	{
		name = n.replace("\\", "_");
		date = d;
		pages = new HashMap<>();
		zones = new HashMap<>();
		linker = new HashMap<>();
		fiches = new HashMap<>();
		fichesLinker = new HashMap<>();
		champs = new HashMap<>();
		areaLinker = new HashMap<>();
		currentPage = null;
		currentFiche = null;
	}
	
	/**
	 * Génére le document é partir des données
	 */
	public void generateDocument() 
	{
		Document d = new Document(name, Document.DECRETS, date);
		for(String p : pages.keySet())
			d.addPage(p, pages.get(p));
		Main.addDocument(name, d);
	}

	/**
	 * Ajoute une page é l'accumulateur
	 * @param id
	 * 		Numéro de page
	 * @param image
	 * 		Chemin de l'image
	 */
	public void addPage(String id, String image) 
	{
		pages.put(id, new Page(id, image));
		currentPage = pages.get(id);
	}
	
	/**
	 * Ajoute une zone é l'accumulateur
	 * @param id
	 * 		ID de la zone
	 * @param positions
	 * 		Elements de positions de la zone
	 */
	public void addZone(String id, String[] positions) 
	{
		zones.put(id, positions);
		linker.put(positions, currentPage);
	}
	
	/**
	 * Ajoute une fiche é l'accumulateur
	 * @param id
	 * 		ID de la fiche
	 * @param type
	 * 		Type de la fiche
	 */
	public void addFiche(String id, String type) 
	{
		fiches.put(id, new Input());
		currentFiche = fiches.get(id);
		currentFiche.setType(type);
		fichesLinker.put(currentFiche, new HashSet<>());
	}
	
	/**
	 * Permet de lier une fiche é une zone
	 * @param id
	 * 		ID de la zone é lier é la fiche courante
	 */
	public void linkInput(String id) 
	{
		fichesLinker.get(currentFiche).add(linker.get(zones.get(id)));
	}
	

	/**
	 * Permet de lier une zone é une champ
	 * @param id
	 * 		ID de la zone é lier au champ
	 */
	public void linkArea(String id)
	{
		String[] positions = zones.get(id);
		for(int i = 0; i+1 < positions.length; i+= 2)
			currentChamp.addPoint(Integer.parseInt(positions[i]), Integer.parseInt(positions[i+1]));
		areaLinker.put(currentChamp, positions);
	}

	/**
	 * Ajoute du texte au champ courant
	 * @param text
	 * 		Texte é ajouter
	 */
	public void linkText(String text)
	{
		currentChamp.createNewAnnotation(text);
	}
	
	/**
	 * Ajoute un champ é l'accumulateur
	 * @param id
	 * 		ID du champ
	 * @param name
	 * 		Nom du champ
	 */
	public void addArea(String id, String name) 
	{
		if(!champs.containsKey(name))
			champs.put(name, new Champ(null, name));
		currentChamp = champs.get(name);
	}
	
	/**
	 * Génére des fiches é partir des données de l'accumulateur
	 */
	public void generateFiche() 
	{
		Input f = null;
		//Pour chaque page liée é la fiche courante
		for(Page p : fichesLinker.get(currentFiche))
		{
			f = new Input();
			f.setType(currentFiche.getType());
			//Pour chaque champ
			for(Champ c : champs.values())
			{
				String[] positions = areaLinker.get(c);
				//S'il n'a pas de position ou si le champ se trouve sur la page
				if(positions == null || linker.get(positions) == p)
					f.addChamp(c);
			}
			//On crée la zone de la fiche
			f.createPointsFromInput();
			p.addFiche(f);
		}
		champs.clear();
		areaLinker.clear();
		currentChamp = null;
	}
}
