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
	public Place addPlaceTo(Long mapId, Place place) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Place detached = null;
		
		try {
			tx.begin();
			Map mapPersistent = pm.getObjectById(Map.class, mapId);
			
			place.setMapId(mapId);
			
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
			placePersistent.setMapId(place.getMapId());
			
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


	@Override
	public Place getPlace(Long ID) {
		Place place = null;
		Place detached = null;

		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();

		try {
			tx.begin();
			place = pm.getObjectById(Place.class, ID);
			place.toString();
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
	public Map deletePlaceTo(Long mapId, Place place) {
		PersistenceManager pm = pmf.getPersistenceManager();
		Transaction tx = pm.currentTransaction();
		
		Map detached = null;

		try {
			tx.begin();
			
			Map map = pm.getObjectById(Map.class, mapId);
			map.removePlace(place);
			
			detached = pm.detachCopy(map);
			
			place = pm.getObjectById(Place.class, place.getID());
			
			pm.deletePersistent(place);
			
			tx.commit();

		} finally {
			if (tx.isActive()) {
				tx.rollback();
			}
			pm.close();
		}
		
		return detached; 

	}


}
