package com.glproject.map_tagger.ws;

import java.util.Arrays;
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
import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.User;

@Path("/User")
public class UserResource {
	
	/**
	 * The ID of the last user connected:
	 */
	static Long lastConnection = null;
	

	/**
	 * 
	 * @param data has to be like: [username,password]
	 * @return
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/connection")
	public Boolean retrieveIdentity(String[] data) {
		
		String username = data[0];
		String password = data[1];
		
		List<User> usersRegistered = DAO.getUserDao().getUsers(username);
		
		for (User user : usersRegistered) {
			if (user.hasPassword(password)) {
				lastConnection = user.getId();
				return true;
			}
		}	
		return false;
	
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/update/{userId}/visibility/{mapId}")	
	public User updateVisibilityOf(@PathParam("userId") String userId,@PathParam("mapId") String mapId,boolean visibility) {
		User user = DAO.getUserDao().getUser(Long.parseLong(userId));
		user.setVisibilityOf(Long.parseLong(mapId), visibility);
		
		user = DAO.getUserDao().updateUser(user);
		
		return user;
	}
	
	/***
	 * this webservice is used to drop a movie from the sharedMap list into the map list of the user
	 * this is the agreement of an invitation by an other user to follow a specific map
	 * @param userId
	 * @param map
	 * @return
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getSharedMap/{userId}")	
	public User getSharedMap(@PathParam("userId") String userId,Map map) {
		User user = DAO.getUserDao().getUser(Long.parseLong(userId));
		user.addMap(map);
		user.removeMapShared(map);
		user = DAO.getUserDao().updateUser(user);
		
		return user;
	}
	
	
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/remove/sharedMap/{userId}")	
	public User ignoreMapShared(@PathParam("userId") String userId, Map map) {
		User user = DAO.getUserDao().getUser(Long.parseLong(userId));	
		user.removeMapShared(map);
		user = DAO.getUserDao().updateUser(user); 
		
		return user;
		
	}
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/remove/map/{userId}")	
	public User removeMap(@PathParam("userId") String userId, Map map) {
		User user = DAO.getUserDao().getUser(Long.parseLong(userId));	
		user.removeMap(map);
		user = DAO.getUserDao().updateUser(user); 
		
		return user;
		
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{id}")
	public User getUser(@PathParam("id") String id) {	
		return DAO.getUserDao().getUser(Long.parseLong(id));
	}

	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/currentSession")
	public User getCurrentUser() {
		User user = DAO.getUserDao().getUser(lastConnection);	
		return user;
	}
	
	
	
	/**
	 * 
	 * @param data has to be like: [username,password]
	 * @return
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create")	
	public Response createUser(Object[] data) {
		
		String username = (String) data[0];
		String password = (String) data[1];
		
		User newUser = new User(username, password);
		newUser = DAO.getUserDao().addUser(newUser);
					
		lastConnection = newUser.getId();
		
		return Response.ok(newUser).build();
	}
	
	/**
	 * Used to generate a DEMO user !
	 * @param user
	 * @return
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/add")
	public Response generateUser(User user) {
		
		String loremIpsum = "Quo cognito Constantius ultra mortalem modum exarsit ac nequo casu idem "
				          + "Gallus de futuris incertus agitare quaedam conducentia saluti suae "
				          + "per itinera conaretur, remoti sunt omnes de industria milites agentes in civitatibus perviis.";
		
		List<String> toShare = Arrays.asList(new String[] {"My favorite chinese restaurants",
														   "Best cinema in Tours",
														   "Boulangeries"});
		
		/**
		 * This webservice can be only used before the first connection !
		 */
		if(lastConnection==null) {
			User detached = DAO.getUserDao().addUser(user);
			
			for (Map map : detached.getMapList()) {
				map.setCreatorId(detached.getId());
				if(map.getDescription().equals("")) {
					map.setDescription(loremIpsum);
				}
				for (Place place : map.getPlaces()) {
					place.setMapId(map.getID());
					
					if (place.getDescription().equals("")) {
						place.setDescription(loremIpsum);
					}
					if (place.getMessages().isEmpty()) {
						for (int i = 0; i < 4; i++) {
							place.addMessage(loremIpsum);
						}
					}
					
					place = DAO.getPlaceDao().updatePlace(place);
				}
				map = DAO.getMapDao().updateMap(map);
				detached.setVisibilityOf(map.getID(), true);
			}
			
			detached = DAO.getUserDao().updateUser(detached);
			
			if (detached.getName().equals("Romain")) {
				for (String mapName : toShare) {
					Map map = DAO.getMapDao().getMaps(mapName).get(0);
					DAO.getMapDao().addSharedMapTo(detached.getId(), map);
				}
			}
			return Response.ok(detached).build();
		}
		
		return Response.ok(false).build();
	}
	
	@DELETE
	@Consumes(MediaType.APPLICATION_JSON)
	public void deleteUser(User user) {
		DAO.getUserDao().delete(user);
	}
}










