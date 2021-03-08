package com.glproject.map_tagger;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.filter.LoggingFilter;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.User;

public class JettyMain {
	
	/**
	 * Just to put fake objects into the database in order to test
	 * features of the application
	 */
	private static void generateFakeObjects() {
		User user = new User("Jean","123456","paris");
		
		Map map = new Map("Jean","Gardens of Paris");
		map.setDescription("All gardens I have visited during my holidays in Paris");
		
		user.addMap(map);
		
		Place place = new Place("Pretty garden","Paris");
		place.setDescription("A pretty garden in Paris");
		place.addTag("nature");
		place.addTag("Green");
		
		map.addPlace(place);
		
		DAO.getUserDao().addUser(user);
		
		User user2 = new User("Paul","paul123456","London");
		Map map2 = new Map("Paul","Gardens of London");
		map2.setDescription("All gardens I have visited during my holidays in London");
		user2.addMap(map2);
		
		Place place2 = new Place("Pretty garden","London");
		place2.setDescription("A pretty garden in London");
		place2.addTag("nature");
		place2.addTag("England");
		
		map2.addPlace(place2);
		
		DAO.getUserDao().addUser(user2);
		
		
		User auriane = new User("enairuA","Camelias1408","Alfortville");
		DAO.getUserDao().addUser(auriane);
		
	}
	
	
	
	public static void main(String[] args) throws Exception {

		Server server = new Server();

		ServerConnector connector = new ServerConnector(server);
		connector.setHost("0.0.0.0");
		connector.setPort(8080);
		connector.setIdleTimeout(30000);
		server.addConnector(connector);

		// Configure Jersey
		ResourceConfig rc = new ResourceConfig();
		rc.packages(true, "com.glproject.map_tagger.ws");
		rc.register(JacksonFeature.class);
		rc.register(LoggingFilter.class);

		// Add a handler for resources (/*)
		ResourceHandler handlerPortal = new ResourceHandler();
		handlerPortal.setResourceBase("src/main/webapp");
		handlerPortal.setDirectoriesListed(false);
		handlerPortal.setWelcomeFiles(new String[] { "index.html" });
		ContextHandler handlerPortalCtx = new ContextHandler();
		handlerPortalCtx.setContextPath("/");
		handlerPortalCtx.setHandler(handlerPortal);

		// Add a servlet handler for web services (/ws/*)
		ServletHolder servletHolder = new ServletHolder(new ServletContainer(rc));
		ServletContextHandler handlerWebServices = new ServletContextHandler(ServletContextHandler.SESSIONS);
		handlerWebServices.setContextPath("/ws");
		handlerWebServices.addServlet(servletHolder, "/*");

		// Activate handlers
		ContextHandlerCollection contexts = new ContextHandlerCollection();
		contexts.setHandlers(new Handler[] { handlerWebServices, handlerPortalCtx });
		server.setHandler(contexts);

		// Start server
		server.start();
		
		generateFakeObjects();
	}
}
