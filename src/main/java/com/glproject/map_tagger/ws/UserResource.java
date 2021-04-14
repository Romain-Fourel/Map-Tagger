package com.glproject.map_tagger.ws;

import java.util.List;

import javax.ws.rs.Consumes;
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

@Path("/User")
public class UserResource {
	
	/**
	 * The ID of the user currently connected
	 */
	static Long currentSession = null;
	
	/**
	 * set the user currently connected by his id
	 * @return
	 */
	
	public static void setCurrentSession(Long currentSession) {
		UserResource.currentSession = currentSession;
	}
	
	public static Long getCurrentSession() {
		return currentSession;
	}
	


	/**
	 * 
	 * @param data has to be like: [username,password]
	 * @return
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/connection")
	public Boolean retrieveIdentity(Object[] data) {
		
		String username = (String) data[0];
		String password = (String) data[1];
		
		List<User> usersRegistered = DAO.getUserDao().getUsers(username);
		
		for (User user : usersRegistered) {
			if (user.hasPassword(password)) {
				currentSession = user.getID();
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
		User user = DAO.getUserDao().getUser(currentSession);	
		System.out.println(user.toCompleteString());
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
					
		currentSession = newUser.getID();
		
		return Response.ok(newUser).build();
	}
}










