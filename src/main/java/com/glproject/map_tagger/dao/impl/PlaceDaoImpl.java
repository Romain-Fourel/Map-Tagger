package com.glproject.map_tagger.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import javax.jdo.Transaction;

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
		
		Place detached = null;
		
		try {
			tx.begin();
			detached = pm.makePersistent(place);
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
	public List<Place> getPlaces(List<String> tag) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Place> getPlaces(String name) {
		// TODO Auto-generated method stub
		return null;
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
	public List<Place> getPlacesNear(String location, int radius) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(Place place) {
		// TODO Auto-generated method stub

	}

}
