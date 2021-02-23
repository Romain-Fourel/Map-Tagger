package com.glproject.map_tagger.ws;

import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.User;

@Path("/glproject")
public class GLprojectResource {
	
	
	/**
	 * An example of implementation of the class user to make the stubs
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/user")
	public User getUser() {
		System.out.println("On arrive dans le getUser!");
		User user = new User();
		user.setId(1);
		user.setLocation("paris");
		user.setMapList(new ArrayList<Map>());
		
		return user;
	}
	
	/**
	 * An example of implementation of the class user to make the stubs
	 * @param user
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/user")
	public void retrieveUser(User user) {
		System.out.println(user.getId()+" "+user.getLocation());
	}
	
	
}





