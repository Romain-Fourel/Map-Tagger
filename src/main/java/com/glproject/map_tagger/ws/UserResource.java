package com.glproject.map_tagger.ws;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
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
	 * get into the database the user who has this specific identity
	 * TODO: returns to the webapp the user in order to load his profile 
	 * @param identity
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/connection")
	public Response retrieveIdentity(String identity) {
		
		String username = identity.split("\n")[0];
		String password = identity.split("\n")[1];
		
		System.out.println("Searching for:");
		System.out.println("username: "+username+"\n"+"password: "+password);
		
		List<User> usersRegistered = DAO.getUserDao().getUsers(username);
		
		System.out.println("usernames matched: "+usersRegistered);
		
		for (User user : usersRegistered) {
			if (user.hasPassword(password)) {
				System.out.println("the user "+user+" is the good one!!");
				currentSession = user.getID();
				return Response.ok(user.toString(), MediaType.TEXT_PLAIN).build();
			}
		}	
		
		System.out.println("No user in the database has matched");
		//We want to return an "not accepted" response
		return Response.ok("failed", MediaType.TEXT_PLAIN).build();
		
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/currentSession")
	public User getCurrentUser() {
		User user = DAO.getUserDao().getUser(currentSession);		
		return user;
	}
	
	
	
	/**
	 * TODO for now, I don't know how to create a new user from the userJson
	 * @param identity must be like:
	 * "name
	 * password"
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create")	
	public Response createUser(String identity) {
		
		String username = identity.split("\n")[0];
		String password = identity.split("\n")[1];
		
		User newUser = new User(username, password);
		DAO.getUserDao().addUser(newUser);
		
		currentSession = newUser.getID();
		
		return Response.ok().build();
	}
	
	
	
	
	
	/**
	 * An example of implementation of the class user to make the stubs
	 * 
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fakeUser")
	public User getUser() {
		User user = new User("Alfred");
		user.setPassword("123456");
		user.setMapList(new ArrayList<Map>());

		return user;
	}

	/**
	 * An example of implementation of the class user to make the stubs
	 * 
	 * @param user
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/fakeUser")
	public Response retrieveUser(String userJson) {
		
		//It doesn't work, userJson is not in a handled format by Gson
		//User user = new Gson().fromJson(userJson, User.class);
		
		System.out.println(userJson);
		 
		return Response.ok().build();
		
	}

}










