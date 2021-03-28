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


	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/connection")
	public Response retrieveIdentity(Object[] data) {
		
		String username = (String) data[0];
		String password = (String) data[1];
		
		List<User> usersRegistered = DAO.getUserDao().getUsers(username);
		
		for (User user : usersRegistered) {
			if (user.hasPassword(password)) {
				System.out.println("the user "+user+" is the good one!!");
				currentSession = user.getID();
				return Response.ok(true).build();
			}
		}	
		
		System.out.println("No user in the database has matched");
		//We want to return an "not accepted" response
		return Response.ok(false).build();
		
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
		return user;
	}
	
	
	
	/**
	 * @param identity must be like:
	 * "name
	 * password"
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
		
		System.out.println(DAO.getUserDao().getUsers());
		
			
		currentSession = newUser.getID();
		
		return Response.ok(newUser).build();
	}
}










