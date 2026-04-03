import org.scalatra.LifeCycle
import javax.servlet.ServletContext
import com.example.app.ProductController

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext): Unit = {
    context.mount(new ProductController, "/api")
  }
}
