package com.glproject.map_tagger.ws;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.User;

@Path("/Map")
public class MapResource {
	

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Response updateMap(Map map) {
		
		map = DAO.getMapDao().updateMap(map);	
		
		return Response.ok(map).build();
	}
	
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/addMap/{userId}")
	public Response addMapTo(@PathParam("userId") String userId, Map map) {
		
		map = DAO.getMapDao().addMapTo(Long.parseLong(userId), map);	
			
		return Response.ok(map).build();
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/addSharedMap/{userId}")
	public Response addSharedMapTo(@PathParam("userId") String userId,Map map) {
		
		User user = null;
		
		try {
			user = DAO.getUserDao().getUser(Long.parseLong(userId));
			
		} catch (Exception e) {
			return null;
		}	
		if (user.hasMap(map)) {
			return Response.ok(false).build();
		}
		DAO.getMapDao().addSharedMapTo(user.getId(), map);
		return Response.ok(true).build();
	}
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{id}")
	public Map getMap(@PathParam("id") String id){
		
		long mapid = Long.parseLong(id);
		
		return DAO.getMapDao().getMap(mapid);
	
	}
	
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/allPublic")
	public List<Map> getPublicMap(){
		return DAO.getMapDao().getPublicMaps();
	}
	
	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{id}")
	public List<Map> removeMap(@PathParam("id") String userId, Map map){
		return DAO.getMapDao().deleteMapTo(Long.parseLong(userId), map).getMapList();
	}
	
	
}
