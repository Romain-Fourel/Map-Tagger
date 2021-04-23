package junit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;

import org.junit.Test;

import com.glproject.map_tagger.dao.DAO;
import com.glproject.map_tagger.dao.Map;
import com.glproject.map_tagger.dao.Place;
import com.glproject.map_tagger.dao.User;
import com.glproject.map_tagger.dao.UserDao;
import com.glproject.map_tagger.dao.impl.UserDaoImpl;

public class DaoImplTest {
	
	static void generateMaps(User user) {
		
		for (int i = 0; i < 5; i++) {
			Map map = new Map(user.getId(), "map"+i);
			for (int j = 0; j < 5; j++) {
				Place place = new Place("place"+i+""+j);
				map.addPlace(place);
			}
			user.addMap(map);
		}		
	}

	@Test
	public void userTest() {

		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);

		User user = new User("Alfred");

		userDao.addUser(user);

		Long id = user.getId();

		User userRetrieved = userDao.getUser(id);
		assertEquals("Alfred", userRetrieved.getName());

		DAO.getUserDao().getUser(id);

		assertTrue(true);
	}

	@Test
	public void usersTest() {
		PersistenceManagerFactory pmf = JDOHelper.getPersistenceManagerFactory("Glproject");
		UserDao userDao = new UserDaoImpl(pmf);

		String[] nameTab = { "Jean", "Alfred", "Eugene", "Eude", "Jacques" };
		List<Long> idList = new ArrayList<Long>();

		for (int i = 0; i < nameTab.length; i++) {
			User user = new User(nameTab[i]);
			userDao.addUser(user);
			idList.add(user.getId());
		}

		assertEquals(nameTab.length + 1, userDao.getUsers().size());
		for (int i = 0; i < idList.size(); i++) {
			assertEquals(nameTab[i], userDao.getUser(idList.get(i)).getName());
		}

	}
	
	@Test
	public void retrieveUsersMapsTest() {
		User user1 = new User("user1", "password1");
		
		generateMaps(user1);
		
		DAO.getUserDao().addUser(user1);		
		
		Long id = user1.getId();
		
		User userRetrieved = DAO.getUserDao().getUser(id);
		
		System.out.println("userRetrieved: "+userRetrieved.getMapList());
		
		assertTrue(userRetrieved.getMapList()!=null);

	}
	
	@Test
	public void retrieveUsersPlaces() {
		
		User user1 = new User("user1", "password1");
		generateMaps(user1);	
		DAO.getUserDao().addUser(user1);
		Long id = user1.getId();	
		User userRetrieved = DAO.getUserDao().getUser(id);
		
		assertTrue(userRetrieved.getMapList()!=null);
		
		for (Map map : userRetrieved.getMapList()) {
			System.out.println(map+" : "+map.getPlaces());
			assertTrue(map.getPlaces()!=null);
		}	
	}
	
	@Test
	public void modifyMapsTest() {
		User user = new User("user","pw");
		
		//generate 4 maps with 4 places in each of them and add the maps to the user
		generateMaps(user);
		DAO.getUserDao().addUser(user);
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		
		Map map = pm.getObjectById(Map.class, (long)0 );
		map.setName("a new name");
		map.setDescription("a new description");
		
		pm.close();
		
		System.out.println(DAO.getMapDao().getMap((long)0));
		
		assertEquals("a new name", DAO.getMapDao().getMap((long)0).getName());
		assertEquals("a new description", DAO.getMapDao().getMap((long)0).getDescription());
		
	}
	
	
	@Test
	public void addPlaceToMapTest() {
		User user = new User("user","pw");
		
		//generate 4 maps with 4 places in each of them and add the maps to the user
		generateMaps(user);
		
		DAO.getUserDao().addUser(user);
		Long id = user.getId();	
		User userRetrieved = DAO.getUserDao().getUser(id);

		Long mapId = userRetrieved.getMapList().get(0).getID();
		System.out.println(mapId);

		Place place = new Place("A new place");
		place.setDescription("a pretty place");
		place.setLocation(3.14, 1.414);
		
		PersistenceManager pm = DAO.getPmf().getPersistenceManager();
		
		Map map = pm.getObjectById(Map.class, mapId);
		
		map.addPlace(place);
		
		pm.close();
		
		assertEquals(6, DAO.getMapDao().getMap(mapId).getPlaces().size());
		
		System.out.println(DAO.getMapDao().getMap(mapId).getPlaces());
		

	}

}
















