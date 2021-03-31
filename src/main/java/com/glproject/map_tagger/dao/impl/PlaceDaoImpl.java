package com.glproject.map_tagger.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.PlaceDao;

public class PlaceDaoImpl implements PlaceDao {

	private PersistenceManagerFactory pmf;

	public PlaceDaoImpl(PersistenceManagerFactory pmf) {
		this.pmf = pmf;
	}

	@Override
	public Place addPlace(Place place) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Place detached = new Place();
		
		try {
			tx.begin();
			place = pm.makePersistent(place);	
			detached = pm.detachCopy(place);
			
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}
	
	@Override
	public Place addPlaceTo(Long mapId, Place place) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Place detached = null;
		
		try {
			tx.begin();
			Map mapPersistent = pm.getObjectById(Map.class, mapId);
			
			mapPersistent.addPlace(place);
			
			detached = pm.detachCopy(place);
			
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}

	
	@Override
	public Place updatePlace(Place place) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Place detached = new Place();
		
		try {
			tx.begin();
			Place placePersistent = pm.getObjectById(Place.class, place.getID());
			placePersistent.setName(place.getName());
			placePersistent.setDescription(place.getDescription());
			placePersistent.setMessages(place.getMessages());
			placePersistent.setPictures(place.getPictures());
			placePersistent.setTags(place.getTags());
			
			detached = pm.detachCopy(placePersistent);
								
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}

		return detached;
	}
	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Place> getPlaces() {
		List<Place> places = null;
		List<Place> detached = new ArrayList<Place>();

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();

			Query q = pm.newQuery(Place.class);
			places = (List<Place>) q.execute();
			detached = (List<Place>) pm.detachCopyAll(places);

			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}

	
	@SuppressWarnings("unchecked")
	@Override
	public List<Place> getPlaces(List<String> tags) {
		List<Place> places = null;
		List<Place> detached = new ArrayList<Place>();

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		try {
			tx.begin();

			Query q = pm.newQuery(Place.class);
			q.declareParameters("List<String> tagsPlace");
			
			q.setFilter("tags.containsAll(tagsPlace)");
			places = (List<Place>) q.execute(tags);
			detached = (List<Place>) pm.detachCopyAll(places);

			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Place> getPlaces(String name) {
		List<Place> places = null;
		List<Place> detached = new ArrayList<Place>();

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();

			Query q = pm.newQuery(Place.class);
			q.declareParameters("String namePlace");
			
			q.setFilter("name.indexOf(namePlace)>-1");
			places = (List<Place>) q.execute(name);
			detached = (List<Place>) pm.detachCopyAll(places);

			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Place> getPlacesNear(Place place, double radius) {
		List<Place> places = null;
		List<Place> detached = new ArrayList<Place>();

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();

			Query q = pm.newQuery(Place.class);
			q.declareParameters("Place place,double radius");
						
			q.setFilter(" place.getDistanceTo(this) < radius");
			places = (List<Place>) q.execute(place,radius);
			detached = (List<Place>) pm.detachCopyAll(places);

			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}

	@Override
	public Place getPlace(Long ID) {
		Place place = null;
		Place detached = null;

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			place = pm.getObjectById(Place.class, ID);
			place.getTags();
			place.getMessages();
			detached = pm.detachCopy(place);
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		return detached;
	}


	@Override
	public void delete(Place place) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			
			pm.deletePersistent(place);
			
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}

	}


}
