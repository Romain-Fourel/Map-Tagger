package com.glproject.map_tagger.dao.cont;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.glproject.map_tagger.dao.Map;

@PersistenceCapable
public class MapContainer {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
	protected Long id = null;

	protected List<Map> Maps = null;

	public MapContainer() {
		super();
		Maps = new ArrayList<Map>();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Map> getMaps() {
		return Maps;
	}

	public void setMaps(List<Map> maps) {
		Maps = maps;
	}

}
