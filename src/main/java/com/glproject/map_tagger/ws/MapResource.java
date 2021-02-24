package com.glproject.map_tagger.ws;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Map.Confidentiality;

@Path("/map")
public class MapResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fakeMap")
	public Map getMap() {
		Map map = new Map();
		map.setConfidentiality(Confidentiality.PRIVATE);
		map.setDescription("a new map");
		map.setName("Map 1");
		
		return map;
	}
}







