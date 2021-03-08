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
	 * get into the database the user who has this specific identity
	 * TODO: returns to the webapp the user in order to load his profile 
	 * @param identity
	 * @return
	 */
	@POST
	@Consumes(MediaType.TEXT_PLAIN)
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/connection")
	public Response retrieveIdentity(String identity) {
		
		String username = identity.split("\n")[0];
		String password = identity.split("\n")[1];
		
		System.out.println("username: "+username+"\n"+"password: "+password);
		
		List<User> usersRegistered = DAO.getUserDao().getUsers(username);
		
		System.out.println(usersRegistered);
		
		if (usersRegistered.isEmpty()) {
			System.out.println("We can return a 'no' response");
		}
		for (User user : usersRegistered) {
			if (user.hasPassword(password)) {
				System.out.println("the user "+user+" is the right one!!");
			}
		}	
		
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
		user.setLocation("Paris");
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










